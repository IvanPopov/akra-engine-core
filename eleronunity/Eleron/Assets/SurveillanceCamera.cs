using UnityEngine;
using System.Collections;

[ExecuteInEditMode]
public class SurveillanceCamera : MonoBehaviour
{
	[Range(-90f,90f)]
	public float fRotationX;
	[Range(0f,80f)]
	public float fRotationY;

	public float fFieldOfView = 60.0f;
	public Color fZoneOfViewColor = new Color(255f/255f,165f/255f,80f/255f);

	public GameObject pCameraHinge;
	public GameObject pCameraBody;
	public GameObject pLensesPivot;
	
	Vector2 _fPrevRotation;

	bool _isShowViewZone = false;
	Light _pViewZoneCone;
	Camera _pViewZoneCamera;

	public bool testShowViewZone = false;

	public bool isShowViewZone
	{
		get
		{
			return _isShowViewZone;
		}
		set
		{
			if(value != _isShowViewZone)
			{
				if(_pViewZoneCamera == null)
				{
					GameObject CameraGameObj = new GameObject();
					_pViewZoneCamera = CameraGameObj.AddComponent<Camera>();
					_pViewZoneCamera.name = this.name + "_view_zone_cam";
					_pViewZoneCamera.transform.parent = pLensesPivot != null ? pLensesPivot.transform : this.transform;
					_pViewZoneCamera.transform.localPosition = Vector3.zero;
					_pViewZoneCamera.transform.localRotation = Quaternion.identity;
					_pViewZoneCamera.depth = 2.0f;
					_pViewZoneCamera.rect = new Rect(0.6f,0.1f,0.3f,0.3f);
					_pViewZoneCamera.fieldOfView = fFieldOfView;
				}
				if(_pViewZoneCone == null)
				{
					GameObject LightGameObj = new GameObject();
					_pViewZoneCone = LightGameObj.AddComponent<Light>();
					_pViewZoneCone.name = this.name + "_view_zone_light";
					_pViewZoneCone.transform.parent = pLensesPivot != null ? pLensesPivot.transform : this.transform;
					_pViewZoneCone.transform.localPosition = Vector3.zero;
					_pViewZoneCone.transform.localRotation = Quaternion.identity;
					_pViewZoneCone.type = LightType.Spot;
					_pViewZoneCone.spotAngle = fFieldOfView * _pViewZoneCamera.aspect;
					_pViewZoneCone.color = fZoneOfViewColor;
					_pViewZoneCone.range = 50.0f;
					_pViewZoneCone.intensity = 0.6f;
					_pViewZoneCone.shadows = LightShadows.Soft;
				}

				_pViewZoneCone.enabled = value;
				_pViewZoneCamera.enabled = value;

				_isShowViewZone = value;
			}
		}
	}

	void Awake()
	{
		_fPrevRotation = new Vector2(0f,0f);
	}

	// Use this for initialization
	void Start ()
	{

	}
	
	// Update is called once per frame
	void Update ()
	{
		if( pCameraHinge != null
		   && pCameraBody != null
		   && ( fRotationX != _fPrevRotation.x || fRotationY != _fPrevRotation.y ) )
		{
			UpdateOrientation(fRotationX, fRotationY);

			_fPrevRotation.x = fRotationX;
			_fPrevRotation.y = fRotationY;
		}

		isShowViewZone = testShowViewZone;
	}

	void OnEnable()
	{

	}

	void UpdateOrientation(float rotX, float rotY)
	{
		pCameraHinge.transform.localRotation = Quaternion.identity;
		pCameraBody.transform.localRotation = Quaternion.identity;
		
		pCameraHinge.transform.Rotate(0.0f, rotX * 0.5f, 0.0f, Space.Self);
		pCameraHinge.transform.Rotate(rotY * 0.3f, 0.0f, 0.0f, Space.Self);
		
		pCameraBody.transform.Rotate(rotY * -0.3f, 0.0f, 0.0f, Space.Self);
		
		pCameraBody.transform.Rotate(0.0f, rotX * 0.5f, 0.0f, Space.Self);
		pCameraBody.transform.Rotate(rotY * 0.7f, 0.0f, 0.0f, Space.Self);
	}
}
