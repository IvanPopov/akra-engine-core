using UnityEngine;
using System.Collections;

public class MouseController : MonoBehaviour
{

	public enum ECameraState
	{
		FreeLookMode,
		EditMode
	}

	ECameraState _mCameraState;

	public float _mCameraFlySpeed = 20.0f;
	public float _mCameraFriction = 3.0f;
	public float _mCameraRotateSpeed = 5.0f;
	public float _mCameraRotateFriction = 10.0f;

	Vector3 _mCurrentSpeed;
	Vector3 _mTargetSpeed;

	Vector3 _mCurrentRotation;
	Vector3 _mTargetRotation;
	
	public ECameraState mCameraState
	{
		get
		{
			return _mCameraState;
		}
		private set
		{
			_mCameraState = value;
		}
	}

	void Awake()
	{
		_mCameraState = ECameraState.FreeLookMode;
		_mCurrentSpeed = new Vector3();
		_mTargetSpeed = new Vector3();
	}

	// Use this for initialization
	void Start ()
	{
		
	}
	
	// Update is called once per frame
	void Update ()
	{
		// Moving through scene
		_mTargetSpeed.Set(0f, 0f, 0f);

		_mTargetSpeed += this.transform.forward * Input.GetAxis("Vertical");
		_mTargetSpeed += this.transform.right * Input.GetAxis("Horizontal");
		_mTargetSpeed += this.transform.up * Input.GetAxis("Height");

		_mCurrentSpeed += ( _mTargetSpeed - _mCurrentSpeed ) * Time.deltaTime * _mCameraFriction;

		this.transform.Translate( _mCurrentSpeed * _mCameraFlySpeed * Time.deltaTime, Space.World);


		// Mouse looking
		if(mCameraState == ECameraState.FreeLookMode && Input.GetMouseButton(0))
		{
			_mTargetRotation.y += Input.GetAxis("Mouse X") * _mCameraRotateSpeed;
			_mTargetRotation.x -= Input.GetAxis("Mouse Y") * _mCameraRotateSpeed;
		}

		Quaternion currentRotation = this.transform.localRotation;
		_mCurrentRotation += ( _mTargetRotation - _mCurrentRotation ) * Time.deltaTime * _mCameraRotateFriction;
		currentRotation.eulerAngles = _mCurrentRotation;
		this.transform.localRotation = currentRotation;
	}
}
